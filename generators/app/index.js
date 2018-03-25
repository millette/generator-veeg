'use strict';

// Npm
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
// Const { srilinka, supportedTypes, supportedCdns } = require('srilinka');
const { supportedCdns } = require('srilinka');

// Self
const { description } = require('../../package.json');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.pkg = this.fs.readJSON(this.destinationPath('package.json'), {});
    this.props = { name: this.arguments[0] || this.determineAppname() };

    this.desc(description);
    this.argument('name', {
      type: String,
      description: 'Package name',
      required: false
    });

    this.option('author', {
      type: String,
      description: "Author's name",
      alias: 'a',
      required: false
    });

    this.option('email', {
      type: String,
      description: "Author's email",
      alias: 'e',
      required: false
    });

    this.option('website', {
      type: String,
      description: "Author's website",
      alias: 'w',
      required: false
    });
  }

  initializing() {
    const name = this.user.git.name();
    const email = this.user.git.email();
    this.gitc = { user: {} };
    if (name) {
      this.gitc.user.name = name;
    }
    if (email) {
      this.gitc.user.email = email;
    }
    return this.user.github.username().then(username => {
      this.ghUsername = username;
    });
  }

  prompting() {
    this.log(yosay(`Welcome to the wicked ${chalk.red('generator-veeg')} generator!`));
    const choices = ['vega-lite', 'vega-tooltip'];

    const prompts = [
      {
        name: 'name',
        message: 'Package name:',
        default: this.props.name,
        when: !this.arguments[0]
      },
      {
        name: 'author',
        message: "What's your name:",
        default:
          this.options.author ||
          (this.pkg.author && this.pkg.author.name) ||
          this.gitc.user.name,
        when: !this.options.author
      },
      {
        name: 'email',
        message: "What's your email:",
        default:
          this.options.email ||
          (this.pkg.author && this.pkg.author.email) ||
          this.gitc.user.email,
        when: !this.options.email
      },
      {
        name: 'website',
        message: "What's your website:",
        default:
          this.options.website ||
          (this.pkg.author && this.pkg.author.url) ||
          this.gitc.user.url,
        when: !this.options.website
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
        name: this.props.name,
        author: this.options.author,
        email: this.options.email,
        website: this.options.website,
        ...props,
        ...this.props
      };

      this.composeWith('generator-license', {
        name: this.props.author,
        email: this.props.email || ' ',
        website: this.props.website || ' ',
        defaultLicense: this.pkg.license || 'AGPL-3.0'
      });
    });
  }

  writing() {
    const pkgTpl = this.fs.readJSON(this.templatePath('package.json'));
    const pkg = {
      ...pkgTpl,
      ...this.pkg,
      name: this.props.name,
      author: {
        name: this.props.author,
        email: this.props.email,
        url: this.props.website
      }
    };

    if (this.ghUsername && this.props.name) {
      pkg.repository = [this.ghUsername, this.props.name].join('/');
    }
    this.fs.writeJSON(this.destinationPath('package.json'), pkg);
    this.fs.copy(this.templatePath('bs-config.js'), this.destinationPath('bs-config.js'));
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
