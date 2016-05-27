# shodan-viz
Modern web UI for Shodan.io, a search engine for internet-connected devices. Built with d3.js, Highcharts, and Vue.js.

## Dependencies
* [Ruby 2.2 or higher](https://www.ruby-lang.org/en/documentation/installation/)
* [Bundler](http://bundler.io/)

## Installation
1. Run `$ bundle install`
  * _Optional_: Use your own [API key](https://account.shodan.io/register) in `config/initializers.yml`
2. Run `$ rackup`
3. Navigate to [http://localhost:9292](http://localhost:9292) in a modern browser
4. Enter a query. Examples:
  * Server: SQ-WEBCAM
  * elasticsearch
  * netgear
  * scada
  * admin 1234
  * "china telecom"
  * "default password"
