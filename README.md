# Stormpath Module for JHipster
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> JHipster module, Stormpath API integration for Authorization

<div>
  <a href="http://jhipster.github.io">
    <img src="https://github.com/stormpath/generator-jhipster-stormpath/raw/master/static/jhipster-logo.png">
  </a>
  <a href="https://www.stormpath.com/">
    <img width=125px src="https://github.com/stormpath/generator-jhipster-stormpath/raw/master/static/stormpath-logo.png">
  </a>
</div>

## Introduction

This is a [JHipster](http://jhipster.github.io/) module, that is meant to be used in a JHipster application.

## Prerequisites

This module installs Stormpath's Spring Boot, Spring Security and AngularJS support and configures everything for you.

<img src="https://raw.githubusercontent.com/stormpath/generator-jhipster-stormpath/master/static/yo-jhipster-stormpath.gif" width="800">

You will need a [free Stormpath account](https://api.stormpath.com/register) and API keys installed to use your application after installing this module.

Specifically, this module configures your JHipster application to use the following Stormpath features:

* Login
* Logout
* User Registration
* Forgot Password

Features we hope to add in a future release:

* Change Password
* User Management
* Internationalization

## Installation

As this is a [JHipster](http://jhipster.github.io/) module, we expect you have [JHipster and its related tools already installed](https://jhipster.github.io/installation/).

This module requires JHipster >= 3.0 in order to work.

```bash
npm install -g generator-jhipster-stormpath
```

Install Stormpath on a JHipster generated application:

```bash
yo jhipster-stormpath
```

**NOTE:** To see the Administration menu, you will need a ROLE_ADMIN group configured in Stormpath. Only users in this group will be able to see the Administration menu.

## License

Apache-2.0 © [Stormpath](https://stormpath.com)

[npm-image]: https://img.shields.io/npm/v/generator-jhipster-stormpath.svg
[npm-url]: https://npmjs.org/package/generator-jhipster-stormpath
[travis-image]: https://travis-ci.org/stormpath/generator-jhipster-stormpath.svg?branch=master
[travis-url]: https://travis-ci.org/stormpath/generator-jhipster-stormpath
[daviddm-image]: https://david-dm.org/stormpath/generator-jhipster-stormpath.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/stormpath/generator-jhipster-module
