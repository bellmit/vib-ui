datasources = File.open('../VIB-API/server/datasources.json')
output = File.open('datasoures.txt', 'w')
name = nil
datasources.each do |line|
    # puts name
    if (name.nil? || name == "")
        puts '---------'
        if (line =~ /^  \"([^\"]+)/)
            name = $1
            output.puts name
        end
    elsif (line =~ /^  }/)
        name = nil
    elsif (line =~ /\"url\": \"([^\"]+)/)
        output.puts "url:#{$1}"
    end
end
datasources.close
output.close