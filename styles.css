/**
 * Simple tab-switching functionality. 
 * Each tab is identified by an ID, and each button calls openTab(tabId, buttonElement).
 */
function openTab(tabId, element) {
  // Hide all tabcontent sections
  const tabs = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabs.length; i++) {
    tabs[i].style.display = "none";
  }
  // Remove 'active' class from all tablink buttons
  const buttons = document.getElementsByClassName("tablink");
  for (let j = 0; j < buttons.length; j++) {
    buttons[j].classList.remove("active");
  }
  // Show requested tab, make button active
  document.getElementById(tabId).style.display = "block";
  element.classList.add("active");
}

/**
 * Additional custom logic (e.g., scenario saving, 
 * probability calculations, PDFs, etc.) can be added here.
 */

// For instance, a default load to the Introduction tab (optional):
// window.onload = () => {
//   openTab('introTab', document.querySelector('.tablink'));
// };
