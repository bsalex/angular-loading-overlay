require 'rubygems'

module Jekyll
  module Camelize
    def camelize(input)
      input.capitalize.gsub(/-(.)/){|s| $1.upcase}
    end
  end
end

Liquid::Template.register_filter(Jekyll::Camelize)
