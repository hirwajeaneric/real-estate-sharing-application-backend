# real-estate-sharing-application-backend
This is the back end of the real state sharing application.

## API List
### Estate

1. List: http://localhost:5151/api/v1/estate/list
2. Add: http://localhost:5151/api/v1/estate/add
3. Find by id: http://localhost:5151/api/v1/estate/findById
4. Update: http://localhost:5151/api/v1/estate/update
5. Delete: http://localhost:5151/api/v1/estate/delete
6. Find by location: http://localhost:5151/api/v1/estate/findByLocation
7. Find by owner id: http://localhost:5151/api/v1/estate/findByOwnerId
8. Find by post id: http://localhost:5151/api/v1/estate/findByPostId
9. Find by status: http://localhost:5151/api/v1/estate/findByStatus

10. Picture: http://localhost:5151/api/v1/estates/(Picturer-name)

### User

1. Sign in: http://localhost:5151/api/v1/user/signin
2. Sign up: http://localhost:5151/api/v1/user/signup
3. Request password reset: http://localhost:5151/api/v1/user/requestPasswordReset
4. Reset password: http://localhost:5151/api/v1/user/resetPassword
5. Update user: http://localhost:5151/api/v1/user/update
6. Find by id: http://localhost:5151/api/v1/user/findById
7. Find by email: http://localhost:5151/api/v1/user/findByEmail
8. List: http://localhost:5151/api/v1/user/list
9. Delete account: http://localhost:5151/api/v1/user/delete

10. User profile picturer: http://localhost:5151/api/v1/profiles/(Picturer-name)

### Contract

1. List: http://localhost:5151/api/v1/contract/list
2. Add: http://localhost:5151/api/v1/contract/add
3. Find by id: http://localhost:5151/api/v1/contract/findById
4. Update: http://localhost:5151/api/v1/contract/update
5. Delete: http://localhost:5151/api/v1/contract/delete
6. Find by owner id: http://localhost:5151/api/v1/contract/findByOwnerId
7. Find by tenant id: http://localhost:5151/api/v1/contract/findByTenantId
8. Find by status: http://localhost:5151/api/v1/contract/findByStatus

### Join Post

1. List: http://localhost:5151/api/v1/joinPost/list
2. Add: http://localhost:5151/api/v1/joinPost/add
3. Find by id: http://localhost:5151/api/v1/joinPost/findById
4. Update: http://localhost:5151/api/v1/joinPost/update
5. Delete: http://localhost:5151/api/v1/joinPost/delete
6. Find by estate id: http://localhost:5151/api/v1/joinPost/findByEstateId
7. Find by expected activities: http://localhost:5151/api/v1/joinPost/findByExpectedActivities
8. Find by owner id: http://localhost:5151/api/v1/joinPost/findByOwnerId
9. Find by posting tenant's id: http://localhost:5151/api/v1/joinPost/findByPostTenant

### Join Request

1. List: http://localhost:5151/api/v1/joinRequest/list
2. Add: http://localhost:5151/api/v1/joinRequest/add
3. Find by id: http://localhost:5151/api/v1/joinRequest/findById
4. Update: http://localhost:5151/api/v1/joinRequest/update
5. Delete: http://localhost:5151/api/v1/joinRequest/delete
6. Find by join post: http://localhost:5151/api/v1/joinRequest/findByJoinPost
7. Find by estate id: http://localhost:5151/api/v1/joinRequest/findByEstateId

### Rent Request

1. List: http://localhost:5151/api/v1/rentRequest/list
2. Add: http://localhost:5151/api/v1/rentRequest/add
3. Find by id: http://localhost:5151/api/v1/rentRequest/findById
4. Update: http://localhost:5151/api/v1/rentRequest/update
5. Delete: http://localhost:5151/api/v1/rentRequest/delete
6. Find by estate id: http://localhost:5151/api/v1/rentRequest/findByEstateId
