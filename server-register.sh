. ./server-alias.sh

curlpostjson http://localhost:8080/register -d '{"nick" : "nuno", "pass" : "cool"}'
curlpostjson http://localhost:8080/register -d '{"nick" : "nuno2", "pass" : "cool"}'
curlpostjson http://localhost:8080/register -d '{"nick" : "nuno3", "pass" : "cool"}'
curlpostjson http://localhost:8080/register -d '{"nick" : "nuno4", "pass" : "cool"}'
curlpostjson http://localhost:8080/register -d '{"nick" : "nuno5", "pass" : "cool"}'
curlpostjson http://localhost:8080/register -d '{"nick" : "nuno6", "pass" : "cool"}'