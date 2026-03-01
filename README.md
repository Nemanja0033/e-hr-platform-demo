## Frontend

**Angular role-based frontend for a demo multitenant e-HR platform.**

### Application Architecture
- **Standalone components:** Modern Angular approach with fine-grained reactivity using `signal` store.
- **Authentication flow:** Client stores JWT in local storage after receiving it from the server.  
  > Note: This is only for demo purposes. In production, a more secure approach should be used.
- **Routing:** Lazy loading is implemented. The app is divided into two global portals:
  - **Employee portal**
  - **HR portal**
- **Multitenancy:** Multiple companies can use the same application. Data is isolated by `companyId`, ensuring that HR and employees only see data belonging to their company.
- **WebSocket integration:** Real-time notifications and data updates are implemented using Socket.IO.  
  - Employees receive instant feedback on submitted requests.  
  - HR receives live updates about new sick leave and vacation requests.

### Application Features
- **HR portal:**
  - HR registration and authentication
  - Company management (demo)
  - Employee management (demo)
  - Vacation request review
  - Sick leave reports
  - Real-time notifications for employee requests
- **Employee portal:**
  - Vacation request submission
  - Sick leave submission
  - Real-time confirmation and updates

### Status
This application is in **demo version**, which means:
- The code is not fully tested or production-ready.
- Some parts need to be fixed, optimized, and scaled for real-world usage.
- Possible mistakes or architectural trade-offs are known and will be addressed in future iterations.
