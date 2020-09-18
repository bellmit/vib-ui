def scanWSDL(path)
    wsdl = File.open(path)
    serviceName = nil
    linecount = 1
    url = {}
    wsdl.each do |line|
        # if(!serviceName.nil?)
        #     if( line =~ /operation name=\s?\"([^\"]+)/)
        #         puts $1
        #     end
        #     if( line =~ /<\/.+portType>/)
        #         serviceName = nil
        #     end
        # end
        if( line =~ /portType name=\s?\"([^\"]+)\"/)
            serviceName = $1            
            puts "Service: #{serviceName}"
        end
        if (line =~ /location ?= ?\"([^\"]+)/)
            location = $1
            if(line =~ /import/)
            else
                puts "line #{linecount}: #{location}"
                point = "#{linecount}|#{location}"
                if(url.has_key?(serviceName))
                    url[serviceName].push(point)
                else
                    url[serviceName] = [point]
                end
            end
        end
            linecount = linecount + 1
    end
    wsdl.close
    return url
end

files = Dir['../VIB-API/server/wsdl/**/*.wsdl']
index = 1
url = {}
address = {}
files.each do |path|
    if(path =~ /-old/)
        # puts path
    else
        
        puts "----------- #{index} ---------"
        puts path
        location = scanWSDL(path)
        if(!location.nil?)
            location.each do |key, val|
                url[key] = path
            end
            address = address.merge(location)
        end
        index = index + 1
    end
end
# p url
configwsdl = File.new('configwsdl.txt', 'w')
configwsdl.puts "path|api|line|url"
url.each do |key, val|
    address.each do |addreskey, addressvalue|
        addressvalue.each do |addresslist|
            configwsdl.puts "#{val}|#{addreskey}|#{addresslist.to_s.gsub(/[\[\]\"]/,"")}"
        end
    end
end
configwsdl.close

