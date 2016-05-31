FROM ruby
MAINTAINER Josh Porter <joshporter1@gmail.com>
# copy just Gemfile to avoid doing bundle on every file change
COPY ./Gemfile ./Gemfile.lock /src/
WORKDIR /src
RUN bundler install
COPY . /src

CMD ["rackup", "--host", "0.0.0.0"]
EXPOSE 9292
