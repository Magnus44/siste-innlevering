document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('nav ul li a');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            links.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
            
            const section = document.querySelector(this.getAttribute('href'));
            window.scrollTo({
                top: section.offsetTop - 60,
                behavior: 'smooth'
            });
        });
    });
});

document.getElementById("tilSpillet").addEventListener("click", function(){
    document.location = "../spill/index.html";
});

document.getElementById("tilLeaderboard").addEventListener("click", function(){
    document.location = "../leaderboard/leaderboard.html";
});

    
