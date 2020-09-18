path = '../VIB-API/server/models/Subscription/save-subscription.js'

sourcecode = File.open(path)
steps = []
isPost = false
restconst = {}
restconst['customerInformationSystemAPI'] = 'CISWebService'
    sourcecode.each do |line|
        if (!isPost)
            if (line =~ /soap\.([^\.]+)\.([^\(]+)\(/)
                server = $1
                method = $2
                steps.push("#{server}.#{method}")
                puts "#{server}.#{method}"
            elsif (line =~ /\.post\(/)
                isPost = true;
            end
        else
            if (line =~ /_[^\.]+\.([^\.]+)\.([^,]+)/)
                puts "#{$1}->#{$2}"
                isPost = false;
            end
        end

    end
    sourcecode.close
    if (steps.length == 0)
        server = nil
        sourcecode = File.open(path)
        sourcecode.each do |line|
            if (line =~ /([^ ]+) = soapDataSource.createModel/)
                server = $1
                # puts server
            end
            if (!server.nil?)
                if(line =~ /#{server}\.([^\(]+)/)
                    steps.push("#{server}.#{$1}")
                end
            end
        end
        sourcecode.close
    end

p steps