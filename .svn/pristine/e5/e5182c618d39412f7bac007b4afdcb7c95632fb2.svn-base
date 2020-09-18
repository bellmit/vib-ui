paths = '../VIB-API/**/*.js'

files = Dir[paths]
files.each do |path|
    linecount = 1
    
    file = File.open(path)
    file.each do |line|
        if(line =~ /log4js\.getLogger\(([^\)]+)\)/)
            puts "#{path} #{linecount}: #{$1}"
        end
        linecount = linecount + 1
    end
end