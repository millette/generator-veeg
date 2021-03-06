'use strict';

// Core
const { dirname } = require('path');

// Npm
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const { srilinka, supportedCdns } = require('srilinka');

// Self
const { description } = require('../../package.json');

const likeString = str => String(str || '');

const process = cnt =>
  cnt
    .toString('utf-8')
    .replace(
      '</head>',
      `<%- css.join('\\n') %>
</head>`
    )
    .replace(/<script src="js\/main.js">[^]*<\/script>/, '')
    .replace('<html class="no-js" lang="">', '<html class="no-js" lang="<%= lang %>">')
    .replace(
      '<p>Hello world! This is HTML5 Boilerplate.</p>',
      `<h1>Démo Vega</h1>
<p>Site généré par generator-veeg.</p>
<div id="viz"></div>`
    )
    .replace(
      '</body>',
      `<script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=Promise,Symbol"></script>
      <%- js.join('\\n') %>
    <script src="js/main.js"></script>
    </body>`
    );

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    // Bla this.props = { name: this.arguments[0] || this.determineAppname() };

    this.desc(description);
    this.argument('name', {
      type: String,
      description: 'Package name',
      required: false
    });

    this.option('author', {
      type: likeString,
      description: "Author's name",
      alias: 'a',
      required: false
    });

    this.option('email', {
      type: likeString,
      description: "Author's email",
      alias: 'e',
      required: false
    });

    this.option('website', {
      type: likeString,
      description: "Author's website",
      alias: 'w',
      required: false
    });
  }

  initializing() {
    this.gitc = { user: {} };

    const username = this.user.git.name();
    const email = this.user.git.email();

    if (username) {
      this.gitc.user.name = username;
    }
    if (email) {
      this.gitc.user.email = email;
    } else {
      return Promise.resolve();
    }

    return this.user.github
      .username()
      .then(ghUsername => {
        this.ghUsername = ghUsername;
      })
      .catch(err => {
        this.log(err);
        return Promise.resolve();
      });
  }

  prompting() {
    this.log(
      yosay(
        `Welcome to the wicked ${chalk.red('generator-veeg')} generator!\n${description}`
      )
    );
    const choices = ['vega-lite', 'vega-tooltip'];

    const prompts = [
      {
        name: 'name',
        message: 'Package name:',
        default: this.arguments[0] || this.determineAppname(),
        when: !this.arguments[0]
      },
      {
        name: 'author',
        message: "What's your name:",
        default:
          this.options.author ||
          (this.pkg.author && this.pkg.author.name) ||
          this.gitc.user.name,
        when: this.options.author === undefined
      },
      {
        name: 'email',
        message: "What's your email:",
        default:
          this.options.email ||
          (this.pkg.author && this.pkg.author.email) ||
          this.gitc.user.email,
        when: this.options.email === undefined
      },
      {
        name: 'website',
        message: "What's your website:",
        default:
          this.options.website ||
          (this.pkg.author && this.pkg.author.url) ||
          this.gitc.user.url,
        when: this.options.website === undefined
      },
      {
        type: 'checkbox',
        name: 'vegaAddons',
        message: 'Which addons do you wish to use on top of vega?',
        choices,
        default: choices,
        store: true
      },
      {
        type: 'confirm',
        name: 'preferYarn',
        message: 'Prefer yarn over npm?',
        default: true,
        store: true
      },
      {
        type: 'list',
        name: 'cdn',
        message: 'Use which CDN?',
        choices: supportedCdns,
        default: 'jsdelivr',
        store: true
      },
      {
        type: 'list',
        name: 'hash',
        message: 'Use which hash function for sub-resource integrity (SRI)?',
        choices: ['sha256', 'sha384', 'sha512'],
        default: 'sha512',
        store: true
      }
    ];

    return this.prompt(prompts).then(props => {
      this.resources = ['vega', ...props.vegaAddons, 'vega-embed'];

      this.props = {
        name: this.options.name,
        author: this.options.author,
        email: this.options.email,
        website: this.options.website,
        ...props
      };

      this.composeWith('generator-license', {
        name: this.props.author,
        email: this.props.email,
        website: this.props.website,
        defaultLicense: this.pkg.license || 'AGPL-3.0'
      });
    });
  }

  writing() {
    const pkgTpl = this.fs.readJSON(this.templatePath('package.json'));
    const pkg = {
      ...pkgTpl,
      ...this.pkg,
      name: this.props.name
    };

    if (this.props.author || this.props.email || this.props.website) {
      pkg.author = {};
      if (this.props.author) {
        pkg.author.name = this.props.author;
      }
      if (this.props.email) {
        pkg.author.email = this.props.email;
      }
      if (this.props.website) {
        pkg.author.url = this.props.website;
      }
    }

    if (this.ghUsername && this.props.name) {
      pkg.repository = [this.ghUsername, this.props.name].join('/');
    }

    this.fs.copy(this.templatePath('**'), this.destinationPath(), {
      globOptions: {
        ignore: [
          this.templatePath('package.json'),
          this.templatePath('readme.md'),
          this.templatePath('src/js/main.js')
        ]
      }
    });

    this.fs.writeJSON(this.destinationPath('package.json'), {
      ...pkg,
      name: this.props.name
    });

    const vegaTooltip = this.props.vegaAddons.indexOf('vega-tooltip') !== -1;
    const vegaLite = this.props.vegaAddons.indexOf('vega-lite') !== -1;

    this.fs.copyTpl(
      this.templatePath('src/js/main.js'),
      this.destinationPath('src/js/main.js'),
      { vegaTooltip, vegaLite }
    );

    this.fs.copyTpl(this.templatePath('readme.md'), this.destinationPath('readme.md'), {
      cmd: this.props.preferYarn ? 'yarn' : 'npm run'
    });

    return srilinka({ packages: this.resources, cdn: this.props.cdn }).then(output => {
      const assets = {
        js: [],
        css: []
      };
      output.forEach(x =>
        x[this.props.cdn].forEach(y => y.type && assets[y.type].push(y.html))
      );
      this._html5Boilerplate(assets);
    });
  }

  _html5Boilerplate({ css, js }) {
    const lang = 'fr';
    const h5Index = require.resolve('html5-boilerplate/dist/index.html', module);
    const h5Path = dirname(h5Index);
    const ignore = [
      'index.html',
      'doc/*',
      'js/main.js',
      'browserconfig.xml',
      'tile.png',
      'tile-wide.png',
      '404.html'
    ].map(x => [h5Path, x].join('/'));
    this.fs.copy(h5Path + '/**', this.destinationPath('src'), {
      globOptions: { ignore }
    });
    this.fs.copy(h5Index, this.destinationPath('tmp/index.html'), { process });
    this.fs.copyTpl(
      this.destinationPath('tmp/index.html'),
      this.destinationPath('src/index.html'),
      { lang, css, js }
    );
    this.fs.delete(this.destinationPath('tmp/index.html'));
  }

  install() {
    this.installDependencies({
      npm: !this.props.preferYarn,
      yarn: this.props.preferYarn,
      bower: false
    });
  }

  end() {
    this.log("We're all good!");
  }
};
