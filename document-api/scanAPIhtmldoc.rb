def scanapihtml()
    source = './vib-api*.html'
    docpath = './apidoc.txt'
    # tag = '^\<h3 id=\"(.+_remote)\">(.+)</h3>'
    tag = '<ul class="sectlevel3">'
    taget = '<li><a href=\"(.+)\">(.+)</a>'
    # tag = '^<h3'
    
    # if (!File.file?(docpath))
    files = Dir[source]
    if (!files.nil? && files.length>0)
        p files
        # puts "file not found!!"
        html = File.open(files[0])
        apidoc = File.new(docpath,"w")
        count = 1
        preline = ''
        html.each_line do |line|
            # puts tag
            
            if(line =~ /#{tag}/)
                # puts "#{count} API #{$2} : #{$1}"
                # puts "#{count} #{preline}"
                if(preline =~ /#{taget}/)
                    apidoc.puts "#{$2} : #{$1}"
                    count = count + 1
                end
                
                # puts 'meet'
                # puts line
            end
            preline = line
            # linecount = linecount+1
        end
        html.close
        apidoc.close
    else
        puts "Error :: Not found Source HTML"
    end
end

scanapihtml()