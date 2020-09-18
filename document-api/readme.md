วิธีการใช้งาน

1. ติดตั้ง 
    - Ruby
    - inkscape
    - npm install -g diagrams
2. Path 
    - document-api
        - ruby code
        - vib-api_v.xx.x.html
    - VIB-API
3. run 'ruby scanAPIhtmldoc.rb' เพื่อสร้าง file สำหรับเป็นฐานข้อมูล list ของ API
4. run 'ruby scanCodePath.rb' เพื่อสร้าง file สำหรับเป็นฐานข้อมูล list ของ Source Code
5. run 'ruby genDocument.rb' เพื่อสร้าง report.html
    - ตรวจสอบ method 'renderSequence()' เรื่อง path กรณีต่าง OS
    - ตรวจสอบ method 'renderPNG()' สำหรับ comand และ path กรณีต่าง OS