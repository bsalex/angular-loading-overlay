require 'rubygems'
require 'htmlbeautifier'

module Jekyll
  module FormatHtml
    def format_html(input)
        HtmlBeautifier.beautify(input)
    end
  end
end

Liquid::Template.register_filter(Jekyll::FormatHtml)
