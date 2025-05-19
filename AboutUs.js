document.addEventListener('DOMContentLoaded', function() {
  // Animation for sections when they come into view
  const animateOnScroll = () => {
    const sections = document.querySelectorAll('.about-section');
    
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (sectionTop < windowHeight * 0.75) {
        section.style.animation = 'fadeInUp 1s ease-out forwards';
      }
    });
  };

  // Initialize animations
  window.addEventListener('scroll', animateOnScroll);
  animateOnScroll(); // Run once on load

  // Smooth scrolling for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Console log for debugging
  console.log('About Us page loaded successfully');
  
  // Add hover effect to contact items
  const contactItems = document.querySelectorAll('.contact-info p');
  contactItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const icon = item.querySelector('i');
      if (icon) {
        icon.style.transform = 'scale(1.2)';
        icon.style.transition = 'transform 0.3s ease';
      }
    });
    
    item.addEventListener('mouseleave', () => {
      const icon = item.querySelector('i');
      if (icon) {
        icon.style.transform = 'scale(1)';
      }
    });
  });
});