FROM php:8.1-fpm
RUN apt-get update && apt-get install -y git libzip-dev zip unzip supervisor libpng-dev libjpeg-dev && \
    curl -sS https://getcomposer.org/installer -o composer-setup.php && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
    rm -rf composer-setup.php

# add mysql driver
RUN docker-php-ext-install pdo_mysql opcache

# Add gd
RUN docker-php-ext-configure gd --with-jpeg && docker-php-ext-install gd

# Add zip
RUN docker-php-ext-install zip

RUN mkdir -p /app && \
    useradd -ms /bin/bash php_user && \
    chown -R php_user:php_user /app

USER root

COPY docker-php-ext-* ./docker/docker-php-entrypoint /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-php-entrypoint

#ADD ./env/docker/php-fpm/php.ini $PHP_INI_DIR/php.ini
#ADD ./env/docker/php-fpm/docker.conf /usr/local/etc/php-fpm.d/docker.conf
#ADD ./env/docker/php-fpm/www.conf /usr/local/etc/php-fpm.d/www.conf

WORKDIR /app

ADD . /app

RUN chmod 777 -R storage && \
    chmod 777 -R bootstrap

USER php_user

RUN composer install --no-dev --no-scripts

USER root

CMD ["php-fpm"]
