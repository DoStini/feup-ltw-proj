class Seed {
    constructor(id) {
        this.id = id;
        this.x = Math.random() * 60;
        this.y = Math.random() * (70 - 8) + 8;
        this.rot = Math.random() * 90;
    }

    render(parent) {
        const newElem = document.createElement("div");
        newElem.id = `seed${this.id}`;
        newElem.className = "seed";
        newElem.style.left = this.x + "%";
        newElem.style.top = this.y + "%";
        newElem.style.transform = `rotate(${this.rot}deg)`;

        parent.appendChild(newElem);
    }
}
