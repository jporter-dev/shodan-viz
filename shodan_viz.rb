class ShodanViz < Sinatra::Base
  # get yaml config
  register Sinatra::ConfigFile
  config_file 'config/initializers.yml'
  # init shodan api
  shodan_api = Shodan::Shodan.new(settings.api_key)

  get '/' do
    slim :index
  end

  get '/search/:query' do
    # Todo: parse query to determine whether to use host or query endpoint

    begin
      my_ip = `curl http://ipecho.net/plain` #get current external IP
      # shodan_result = shodan_api.host params['query']
      # shodan_result = shodan_api.search params['query'], facets: 'country:50,timestamp_day:50'
      f = File.read 'shodan_sample_search.json'
      shodan_result = JSON.parse f
    rescue
      # handle no results or timeouts
      shodan_result = Hash.new
    end

    content_type :json
    shodan_result.to_json
  end



end
