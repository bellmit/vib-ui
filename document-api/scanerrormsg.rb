sourecodes = Dir["../src/**/*.component.ts"]
pathoutput = 'errmsg.txt'

output = File.new(pathoutput, 'w')
sourecodes.each do |path|
    code = File.open(path)
    msg = []
    count = 1
    code.each do |line|
        if (line =~ /Modal\.showAlert\(([^\)]+)\)/)     
            errmsg = $1
            if( errmsg =~ /^[eE]rror/)
                puts "line #{count}: #{errmsg}"
            else
                msg.push("line #{count}: #{errmsg}")
            end
        end
        count = count + 1
    end
    code.close
    if(!msg.nil? && msg.length>0 )
        output.puts path
        msg.each do |err|
            output.puts err
        end
        output.puts "\n"
    end
end
output.close