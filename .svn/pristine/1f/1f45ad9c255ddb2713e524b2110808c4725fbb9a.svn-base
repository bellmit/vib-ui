require 'json'

def scancode(filename, models)
    file = File.new(filename, "r")
  
    found = nil
    # connection = nil
    while (line = file.gets)

        if (line =~ / = function \((\w+)\) \{/)
            model = $1.downcase
            if (!models[model].nil?)
                found = model
                puts model
            end
        # puts line
            puts found
        end

    end
    file.close
    
    if (model == 'remote')
        # puts "---------->"
        file = File.new(filename, "r")
        # puts 'remote???????'
        file.each do |line|
            if(line =~ /_response[^\.]+\.([^,]+)/)
                model = $1.downcase
                found = model # "remote.#{model}"
                puts "#{model} ->> #{found}"
            # else
            #     puts "Why Else"
            end
        end
        file.close
    end
  puts "#{model} -> #{found}"
  return found
end

def find_interface(filename)
  file_content = File.read(filename);
  json         = JSON.parse(file_content)
  if (json.has_key? 'http')
    if (json["http"].has_key? 'path')
      return json["http"]["path"]
    end
  end
  return nil
end

def scan_folder(target)
  return Dir[target]
end
apipath = './apipath.txt'

# if (!File.file?(apipath))
    doc = File.new(apipath, "w")
    models  = {}
    target  = '../VIB-API/server/models/**/*.json'
    scan_folder(target).each do |f|
    x = find_interface(f)
    if (!x.nil?)
        models[x.downcase] = 1
        # puts x.downcase
    end
    end

    target  = '../VIB-API/server/models/**/*.js'
    scan_folder(target).each do |f|
        api = scancode(f, models) 
        if(!api.nil?)
            doc.puts "#{api} : #{f}"
        end
    end
# end



