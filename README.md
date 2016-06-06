# shodan-viz
Modern web UI for [Shodan.io](https://www.shodan.io/), a search engine for internet-connected devices. Built with d3.js, Highcharts, and Vue.js.

* [Installation](#installation)
* [Querying](#querying)

## Dependencies
* [Ruby 2.2 or higher](https://www.ruby-lang.org/en/documentation/installation/)
* [Bundler](http://bundler.io/)

## Installation
1. `$ git clone https://github.com/joshporter1/shodan-viz.git`
2. `$ cd shodan-viz && bundle install`
  * _Optional_: Use your own [API key](https://account.shodan.io/register) in `config/initializers.yml`
3. Run `$ rackup`
4. Navigate to [http://localhost:9292](http://localhost:9292) in a modern browser

#### Docker Install
For users who already have Docker set up, the proper files have been supplies to get a container up and running quickly. If you don't have Docker, check out [Docker Toolbox](https://www.docker.com/products/docker-toolbox).

1. `$ git clone https://github.com/joshporter1/shodan-viz.git`
2. `$ cd shodan-viz && docker-compose up`
3. Navigate to `http://<docker-ip>`

## Querying
The Shodan API uses a fairly simple querying syntax, ranging from single-word queries to those including filters if your API key supports it.

Example queries:
* `Server: SQ-WEBCAM`
* `elasticsearch`
* `netgear`
* `apache`
* `scada`
* `admin 1234`
* `"china telecom"`
* `"default password"`

Example filtered queries:
* `nginx city:"Baltimore"`
* `"china telecom" country:"CN"`
* `"admin 1234" os:"Linux"`


_Note: the included API key does not support filtering._
