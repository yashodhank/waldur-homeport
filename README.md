## Introduction

Waldur HomePort is web-based client for the [Waldur MasterMind][1].
It uses yarn for dependency management and webpack as module bundler.

## System Requirements

__Development/testing__:

- Linux (CentOS 7 and Ubuntu 14.04 tested) or OS X
- 2 GB of RAM

## Installation


1. Install dependencies. Example for CentOS 7:
```
yum -y install epel-release https://rpm.nodesource.com/pub_4.x/el/7/x86_64/nodesource-release-el7-1.noarch.rpm
yum -y install bzip2 git libjpeg-turbo-devel libpng-devel libtool make nasm "nodejs-4*" rubygems
gem install sass
npm install -g yarn
```

2. Clone project and go to its folder:
```
git clone <repository-url>
cd waldur-homeport
```

3. Install dependencies:
```
yarn
```

4. Create `/app/scripts/configs/custom-config.json`:
```
cp app/scripts/configs/config.json.example app/scripts/configs/config.json
```

5. Configure `config.json`. Please read [Configuration guide](docs/config.md) to learn more.

6. Run application: `yarn start`.

Server will listen on `//localhost:8000`

## Backend configuration

Use [Waldur MasterMind][1] for backend.

Also you should install django-cors-headers from pip in order to add CORS headers:

```
pip install django-cors-headers
```

Then you should update `nodeconductor/server/settings.py` and add the following 
lines at the end of the file:

```
INSTALLED_APPS += ('corsheaders',)
MIDDLEWARE = ('corsheaders.middleware.CorsMiddleware',) + MIDDLEWARE
CORS_ORIGIN_ALLOW_ALL = True
CORS_EXPOSE_HEADERS = (
    'x-result-count',
    'Link',
)
```

## Development process

See [Development guidelines](docs/development_guideline.md) for development policies.

[1]: https://github.com/opennode/waldur-mastermind
