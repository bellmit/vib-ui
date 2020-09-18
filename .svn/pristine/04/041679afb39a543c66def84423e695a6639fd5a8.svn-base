def getConstant()
    constants = File.open('../VIB-API/common/constant.js')
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

# def getDBlist()
#     list = {}
#     fp = File.open('./dblist.txt')
#     fp.each do |line|
#         key, value = line.chomp.split(" : ")
#         # puts "====> #{key} <===="
#         if(!list.has_key?(key))
#             list[key] = [value]
#         else
#             list[key].push(value)
#         end
#     end
#     return list
# end

def getTableInQuery(constantlist, strconstant)
    # puts "-->>>>#{strconstant}<<<<--"
    outstr = strconstant.split('.')
    if (outstr.length > 0)
        return constantlist[outstr[1]]
    else
        return constantlist[strconstant]
    end
    # puts "----------------"
end

# dblist = getDBlist()
constlist = getConstant()
constlist.each do |key, value|
    puts "------#{key}--------------"
    value.each do |table|
        tb = getTableInQuery(constlist, table)
        if (!tb.nil?)
            p tb
        else
            puts table
        end
    end
end