Real time chat application built in NextJS, NodeJS, MongoDB with TypeScript. 

Used Technologies 

Socket.io - for realtime communication
React Query for API Calls

curl command to create account
```
curl -X POST "http://localhost:5000/apis/users" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John", 
    "lastName": "Doe",
    "userName": "john", 
    "email": "john@gmail.com", 
    "password": "Test@123", 
    "passwordConfirm": "Test@123"
  }'
```


WIP: 
Fetching user chat history and update in UI
Showing user active status in chat
Register API Integration in frontend
