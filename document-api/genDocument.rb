@operRequest = '->'
@operResponse = '-->'
@datalist = "out.txt"

class APIDocument
   
    def initialize(apiName, apiLink, steps, tables)
        @apiName = apiName
        @apiLink = apiLink
        @steps = steps
        @tables = tables
    end

    def api_name
        @apiName
    end

    def api_link
        @apiLink
    end

    def steps
        @steps
    end

    def tables
        @tables
    end

    def sequence_path=(path)
        @sequence_path=path
    end
end

def getAPIDocList(path)
    apiDocs = {}
    fileApiDoc = File.open(path)
    fileApiDoc.each do |aline|
        key, value = aline.chomp.split(" : ")
        apiDocs[key] = value
    end
    # p apiDocs
    fileApiDoc.close
    return apiDocs
end

def getPathList(path)
    paths = {}
    filePath = File.open(path)
    filePath.each do |path|
        key, value = path.chomp.split(" : ")
        paths[key] = value
    end
    # p paths
    filePath.close
    return paths
end

def getConstant(path)
    constants = File.open(path)
    index = 1
    list = {}
    constants.each do |line|
        if( line =~ /(sql[^:]+): `(.+)/)
            cmd = $1
            sql = $2.upcase
            if (sql =~ /.+FROM (.+) WHERE/ || sql =~ /.+FROM ([^`]+)/ || sql =~ /.+FROM (.+) ORDER/)
                
                tables = $1.scan(/VIB\.[^ ]+/)
                list[cmd] = tables
                # puts "#{index}. #{cmd} : " + tables.inspect
                index = index + 1
            end
        elsif ( line =~ /(proc[^:]+): `BEGIN ([^\(]+)/)
            list[$1] = [$2]
        end
    end
    return list
end

def scanCode(api, path)
    sourcecode = File.open(path)
    steps = []
    isPost = false
    rest_const = {}
    rest_const['customerInformationSystemAPI'] = 'CISWebService'
    rest_const['mutualAPI'] = 'PhatraAPI'
    if(api["Form"].nil?)
        sourcecode.each do |line|
            if (!isPost)
                if (line =~ /soap\.([^\.]+)\.([^\(]+)\(/) #SOAP
                    server = $1
                    method = $2
                    steps.push("#{server}.#{method}")
                    # puts "#{server}.#{method}"
                elsif (line =~ /\.post\(/)
                    isPost = true
                end
            else
                if (line =~ /_[^\.]+\.([^\.]+)\.([^,]+)/) #Rest
                    if(rest_const.has_key?($1))
                        puts "#{rest_const[$1]}.#{$2}"
                        steps.push("#{rest_const[$1]}.#{$2}")
                    else
                        steps.push("#{$1}.#{$2}")
                    end
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
    else
        # sourcecode = File.open(path)
        steps.push("Jasper.PDF")
    end
    return steps
end

def getTableInQuery(constantlist, strconstant)
    # puts "-->>>>#{strconstant}<<<<--"
    outstr = strconstant.split('.')
    if (outstr.length > 0)
        # puts "#{constantlist[outstr[1]]}----------"
        return constantlist[outstr[1]]
    else
        # puts "#{constantlist[strconstant]}xxxxxxx"
        return constantlist[strconstant]
    end
    # puts "----------------"
end

def scanDB(api, path, constList)
    connection = nil
    tables = []
    sourcecode = File.open(path)
    sourcecode.each do |line|
        if(line =~ /_dbConfig\.(conn.+)\(/)
            connection = $1
        elsif (line =~ /_dbConfig\.execute\(\w+, ([^,]+)/)
            # puts $1
            tables = getTableInQuery(constList, $1)
            # p "7777777777#{tables}"
        end
    end
    return tables
end

def set_title_seq(title)
    return "title: #{title}\n"
end    

def set_request(from, to, msg)
    return "#{from} #{@operRequest} #{to} : #{msg}\n"
end

def set_response(from, to, msg)
    return "#{from} #{@operResponse} #{to} : #{msg}\n"
end

def gen_sequence(api, steps)
    str_seq = set_title_seq(api)
    
    steps.each do |step|
        method = step.split('.')
        if(method.length>1)
            str_seq = str_seq + set_request("API",method[0], method[1])
        else
            str_seq = str_seq + set_request("API",method[0], step)
        end
        str_seq = str_seq + set_response(method[0], "API", "reponse")
    end
    fname = "./output/#{api.gsub(/[^\/]+\//,"")}.sequence"
    f = File.new(fname,'w+')
    f.puts str_seq
    f.close
    return "#{fname}.svg.png"
    # return "#{fname}.svg"
end

def writeunmanthlog(path, list)
    file = File.new(path, 'w')
    file.puts "---- un match in sourcecode scan -------"
    list.each do |api|
        file.puts api
    end
    file.close
end

def renderSequence()
    exec 'cd output\& diagrams build'
end

def renderPNG()
    outPath = "#{Dir.pwd}\\output"
    cmd = "FOR /R #{outPath} %F in (*.svg) do inkscape -z -y 255 --file=%F --export-png=%F.png"
    exec cmd
end

def scanWSDL(path, list)
    wsdl = File.open(path)
    serviceName = nil
    wsdl.each do |line|
        if(!serviceName.nil?)
            if( line =~ /operation name=\s?\"([^\"]+)/)
                if(list.has_key?(serviceName))
                    list[serviceName].push($1)
                else
                    list[serviceName] = [$1]
                end
            end
            if( line =~ /<\/.+portType>/)
                serviceName = nil
            end
        end
        if( line =~ /portType name=\s?\"([^\"]+)\"/)
            serviceName = $1
        end
    end
    wsdl.close
end

apiDocPath = 'apidoc.txt'
apiPath = 'apipath.txt'
logpath = 'gendoc.log'
outputPath = 'output'
unMatchlist = []
constPath = '../VIB-API/common/constant.js'
apiDocs = getAPIDocList(apiDocPath)
apiPaths = getPathList(apiPath)
constList = getConstant(constPath)
index = 1
numOfMatch = 0
apis = []

apiDocs.each do |api, link|
    puts "---->#{index} #{api} <----------"
    index = index + 1
    apiKey = api.downcase
    apiKey = apiKey.gsub(/[^\/]+\//,"")
    
    if(apiPaths.has_key?(apiKey))
        steps = scanCode(api, apiPaths[apiKey])
        p "steps : #{steps}"
        tables = scanDB(api, apiPaths[apiKey], constList)
        p "tables : #{tables}"
        apidata = APIDocument.new(api, link, steps, tables)
        # puts apidata.api_name
        
        apis.push(apidata)
        puts "#{apis.length}"
    else
        unMatchlist.push api
    end
    writeunmanthlog(logpath, unMatchlist)
end
divTableofContent = "<div>\n<ul>\n"
divContent = "<div>\n"
puts apis.length
apis.each do |api|
    
    sequence_path = '' 
    
    divToC = "<li><a href=\"#{api.api_link.gsub("\n","")}\"><h4>#{api.api_name}</h4></a></li>\n"
    div = "<div>\n"
    div = div + "<div><h4><a id='#{api.api_link.gsub(/[#\n]/,"")}' href='./vib-api_v1.0.2.html#{api.api_link.gsub("\n","")}' target='_blank'>#{api.api_name}</a></h4></div>\n"
    div = div + "<div><h5>Description:</h5></div><div>&nbsp;</div>"
    
    if (api.steps.length > 0 )
        sequence_path = gen_sequence(api.api_name, api.steps)
        # api.sequence_path = sequence_path
        # div = div + "<div>\n"
        div = div + "<div><h5>Sequence Diagram</h5></div>"
        div = div + "<div style='width: 100%' align='center'><a href='./vib-api_v1.0.2.html#{api.api_link.gsub("\n","")}' target='_blank'><img src='#{sequence_path}'></a></div>\n"
        # div = div + "</div>\n"
    end

    if (!api.tables.nil? && api.tables.length > 0)
        # div = div + "<div>\n"
        div = div + "<div><h5><b>Database:</b></h5></div>"
        # div = div + "<div>\n"
        div = div + "<div style='font-size: 12px;'>#{api.tables.inspect.gsub(/[\"\[\]\n]/,"")}</div>"
        # div = div + "</div>\n</div>\n"
    end
    div = div + "</div>\n"
    if (api.steps.length>0 || (!api.tables.nil? && api.tables.length > 0))
        divContent = divContent + div + "</br>"
        divTableofContent = divTableofContent + divToC
    end
    
    

end
divTableofContent = divTableofContent + "</ul>\n</div>\n"
divContent = divContent + "</div>\n"

files = Dir['../VIB-API/server/wsdl/**/*.wsdl']
flist = {}
files.each do |path|
    if(path =~ /-old/)
        # puts path
    else       
        scanWSDL(path, flist)
    end
end
divWSDL = "<div>\n"
divWSDL = divWSDL + "<div><h2>WSDL List</h2></div>\n"
flist.each do |key, value|
    divWSDL = divWSDL + "<div>\n"
    divWSDL = divWSDL + "<div><h3>#{key}</h3></div>\n"
    divWSDL = divWSDL + "<div>\n<ul>\n"
    value.each do |method|
        divWSDL = divWSDL + "<li>#{method}</li>\n"
    end
    divWSDL = divWSDL + "</ul>\n</div>\n"
    divWSDL= divWSDL + "</div>\n"
end
divWSDL = divWSDL + "</div>\n"




html = File.new("report2.html", 'w')
html.puts "<div><h2>Table of Content</h2></div>\n"
html.puts divTableofContent
html.puts "<div><h2>VIB-API list</h2></div>\n"
html.puts divContent
html.puts divWSDL
html.close
renderSequence()
renderPNG()


