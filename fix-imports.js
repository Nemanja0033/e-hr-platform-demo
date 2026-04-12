const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

walk('src/app', function(filePath) {
    if (filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let newContent = content.replace(/['"](.*?)pages\/(.*?)['"]/g, "'$1modules/$2'");
        
        // Replace service imports
        newContent = newContent.replace(/['"](.*?)core\/services\/company\.service(.*?)['"]/g, "'$1modules/hr/services/company.service$2'");
        newContent = newContent.replace(/['"](.*?)core\/services\/employee\.service(.*?)['"]/g, "'$1modules/hr/services/employee.service$2'");
        newContent = newContent.replace(/['"](.*?)core\/services\/sick-leave-reports\.service(.*?)['"]/g, "'$1modules/hr/services/sick-leave-reports.service$2'");
        newContent = newContent.replace(/['"](.*?)core\/services\/vacation-review\.service(.*?)['"]/g, "'$1modules/hr/services/vacation-review.service$2'");
        
        newContent = newContent.replace(/['"](.*?)core\/services\/sick-leave-request\.service(.*?)['"]/g, "'$1modules/employee/services/sick-leave-request.service$2'");
        newContent = newContent.replace(/['"](.*?)core\/services\/vacation-request\.service(.*?)['"]/g, "'$1modules/employee/services/vacation-request.service$2'");
        
        newContent = newContent.replace(/['"](.*?)core\/services\/http\/auth-http\.service(.*?)['"]/g, "'$1modules/gateway/services/auth-http.service$2'");
        newContent = newContent.replace(/['"](.*?)core\/services\/http\/company-http\.service(.*?)['"]/g, "'$1modules/hr/services/company-http.service$2'");
        newContent = newContent.replace(/['"](.*?)core\/services\/http\/employee-http\.service(.*?)['"]/g, "'$1modules/hr/services/employee-http.service$2'");
        newContent = newContent.replace(/['"](.*?)core\/services\/http\/sick-leave-reports-http\.service(.*?)['"]/g, "'$1modules/hr/services/sick-leave-reports-http.service$2'");
        newContent = newContent.replace(/['"](.*?)core\/services\/http\/vacation-review-http\.service(.*?)['"]/g, "'$1modules/hr/services/vacation-review-http.service$2'");
        newContent = newContent.replace(/['"](.*?)core\/services\/http\/sick-leave-request-http\.service(.*?)['"]/g, "'$1modules/employee/services/sick-leave-request-http.service$2'");
        newContent = newContent.replace(/['"](.*?)core\/services\/http\/vacation-request-http\.service(.*?)['"]/g, "'$1modules/employee/services/vacation-request-http.service$2'");

        if (content !== newContent) {
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log('Updated imports in: ' + filePath);
        }
    }
});
