document.addEventListener('DOMContentLoaded', () => {
    const notifications = [
        "New 7-day Free Trial available!",
        "Discount on Advanced Package this week!",
        "Sign Language tutorials uploaded!",
        "Don't miss our interactive lessons!"
    ];

    const list = document.getElementById('notification-list');
    notifications.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'notification';
        div.textContent = msg;
        list.appendChild(div);
    });

    // Animate notification appearance
    const notifyElements = document.querySelectorAll('.notification');
    notifyElements.forEach((el, i) => {
        el.style.opacity = 0;
        setTimeout(() => { el.style.transition = 'opacity 1s'; el.style.opacity = 1; }, i * 500);
    });
});
