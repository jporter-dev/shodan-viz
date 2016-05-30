FROM ruby
MAINTAINER Josh Porter <joshporter1@gmail.com>

COPY . /src
WORKDIR /src
RUN bundler install

CMD ["rackup", "--host", "0.0.0.0"]
EXPOSE 9292
