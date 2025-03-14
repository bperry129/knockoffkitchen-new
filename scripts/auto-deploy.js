// Script to automatically push changes to GitHub after generating a recipe
const { exec } = require('child_process');
const path = require('path');

// Function to execute a command and return a promise
function executeCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`Executing: ${command}`);
    
    exec(command, { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error.message}`);
        return reject(error);
      }
      
      if (stderr) {
        console.log(`Command stderr: ${stderr}`);
      }
      
      console.log(`Command stdout: ${stdout}`);
      resolve(stdout);
    });
  });
}

// Main function to push changes to GitHub
async function pushToGitHub() {
  try {
    console.log('Starting auto-deploy process...');
    
    // Add all changes
    await executeCommand('git add .');
    
    // Commit changes with a descriptive message
    const commitMessage = `Auto-deploy: Updated generateStaticParams with new recipe slug`;
    await executeCommand(`git commit -m "${commitMessage}"`);
    
    // Push to GitHub
    await executeCommand('git push origin master');
    
    console.log('Successfully pushed changes to GitHub. Netlify deployment should start automatically.');
  } catch (error) {
    console.error('Error pushing to GitHub:', error);
  }
}

// Run the script
pushToGitHub().then(() => {
  console.log('Auto-deploy script completed.');
}).catch(error => {
  console.error('Auto-deploy script failed:', error);
  process.exit(1);
});
