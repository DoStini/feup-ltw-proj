

curlpostjson -d '{"nick": "nuno", "pass": "cool", "size":4, "initial": 3}' http://localhost:8080/join        
curlpostjson -d '{"nick": "nuno", "pass": "cool", "game":"8fc76175bd5cf69eb62f5a89d335045d"}' http://localhost:8080/leave 
curlpostjson http://localhost:8080/ranking  