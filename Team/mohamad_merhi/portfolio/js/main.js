//add class active to header on scroll

let header = document.querySelector("header");

window.onscroll = function(){

    if(this.scrollY >= 50){
        header.classList.add("active");
    }else{
        header.classList.remove("active");
    }

}

let nav_links = document.getElementById("links");

function Open_colose_Menu(){
    nav_links.classList.toggle("active");
}

let menu_links = nav_links.querySelectorAll("a:not(.logo)");

menu_links.forEach(function(link){
    link.addEventListener("click", function(){
        nav_links.classList.remove("active");
    });
});

// Project Coming Soon Message
let comingSoonButtons = document.querySelectorAll(".coming-soon");
let projectMessage = document.getElementById("projectMessage");

let messageTimeout;

comingSoonButtons.forEach(function(button) {

    button.addEventListener("click", function(e) {

        e.preventDefault();

        // Show message
        projectMessage.classList.add("active");

        // Clear previous timer
        clearTimeout(messageTimeout);

        // Hide after 4 seconds
        messageTimeout = setTimeout(function() {
            projectMessage.classList.remove("active");
        }, 4000);

    });

});