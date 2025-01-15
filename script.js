/**
 * This script handles the tab-switching functionality.
 * Each tab is associated with a div of class "tabcontent".
 * Each button is a "tablink" that calls openTab() with its target content ID.
 */

// Switch between tabs
function openTab(tabId, element) {
  // Hide all .tabcontent
  const allTabs = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < allTabs.length; i++) {
    allTabs[i].style.display = "none";
  }
  // Remove "active" class from all .tablink buttons
  const allTabLinks = document.getElementsByClassName("tablink");
  for (let j = 0; j < allTabLinks.length; j++) {
    allTabLinks[j].classList.remove("active");
  }
  // Show the requested tab, set this button to active
  document.getElementById(tabId).style.display = "block";
  element.classList.add("active");
}

/**
 * Any additional code (e.g., logic for scenario saving, 
 * dynamic chart creation, DCE calculations) can go here.
 */

// Example: we can set a default tab on page load if we like:
// window.onload = function() {
//   openTab('introTab', document.querySelector('.tablink'));
// };
