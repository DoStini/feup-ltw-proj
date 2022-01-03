class SeedAnimation {
    #steps = [];

    /**
     * 
     * @param {Object.<number, Array.<number>>} holeToHoles 
     */
    addStep(holeToHoles) {
        this.steps.push(holeToHoles);
    }

    get steps() {
        return this.#steps;
    }
}

class Animator {
    /**
     * 
     * @param {number} nHoles 
     * @param {SeedAnimation} steps 
     */
    async executeAnimation(nHoles, animation) {

    }
}

class HTMLAnimator extends Animator {
    calculateTargetPosition(seed, hole) {
        const copySeed = seed.cloneNode();
        copySeed.style.transform = "";
        copySeed.id = `copy-${seed.id}`;

        hole.append(copySeed);
        const { left, top } = copySeed.getBoundingClientRect();

        copySeed.remove();

        return {
            left,
            top,
        }
    }

    calculateInitialPosition(seed, hole) {
        const copySeed = seed.cloneNode();
        copySeed.style.transform = "";
        copySeed.id = `copy-${seed.id}`;

        hole.append(copySeed);
        const rect = copySeed.getBoundingClientRect();

        copySeed.remove();

        return rect;
    }

    /**
     * 
     * @param {number} nHoles 
     * @param {SeedAnimation} animation 
     */
    async executeAnimation(nHoles, animation) {
        const steps = animation.steps;

        for (let step = 0; step < steps.length; step++) {
            const holeToHoles = steps[step];
            let animations = [];

            for (let hole in holeToHoles) {
                animations.push(this.animateSeeds(hole, nHoles, holeToHoles[hole]));
            }

            await Promise.all(animations);
        }
    }

    async animateSeeds(holeId, nHoles, idList) {

        const animationDuration = 2;
        const animationDelay = 0.1;
        const positionDuration = animationDuration - animationDelay;
        const dimensionDuration = (animationDuration - animationDelay) / 2;
        const animationInterval = 0.2;

        const boardOffset = nHoles * 2;
        const hole = document.getElementById(`hole-${holeId}`);
        const board = document.getElementById("board");

        const numSeeds = hole.children.length;

        Array.from(hole.children).reverse().forEach((seed, idx) => {
            setTimeoutClearable(() => {
                const currentHoleId = idList[idx];
                const isHole = currentHoleId < boardOffset;
                const nextHole = document.getElementById(isHole ? `hole-${currentHoleId}` : `storage-${currentHoleId - boardOffset}`);
                if (nextHole == null) {
                    return;
                }
                const { left: targetLeft, top: targetTop } = this.calculateTargetPosition(seed, nextHole, board);

                const { left, top, height, width } = this.calculateInitialPosition(seed, hole);

                seed.remove();

                const fakeSeed = seed.cloneNode();

                board.appendChild(fakeSeed);
                fakeSeed.style.position = "fixed";
                fakeSeed.id = `fake-${seed.id}`;
                fakeSeed.style.left = `${left}px`;
                fakeSeed.style.top = `${top}px`;
                fakeSeed.style.zIndex = "5";
                fakeSeed.style.width = `${width}px`;
                fakeSeed.style.height = `${height}px`;


                setTimeoutClearable(() => {
                    fakeSeed.style.transition = `left ${positionDuration}s, top ${positionDuration}s, width ${dimensionDuration}s, height ${dimensionDuration}s`;
                    fakeSeed.style.left = `${targetLeft}px`;
                    fakeSeed.style.top = `${targetTop}px`;
                    fakeSeed.style.width = `${width + 30}px`;
                    fakeSeed.style.height = `${height + 30}px`;

                }, animationDelay * 1000);

                setTimeoutClearable(() => {
                    fakeSeed.style.width = `${width}px`;
                    fakeSeed.style.height = `${height}px`;
                }, (animationDelay + dimensionDuration) * 1000);

                setTimeoutClearable(() => {
                    fakeSeed.remove();
                    nextHole.append(seed);
                }, animationDuration * 1000);

            }, animationInterval * idx * 1000);
        });


        return new Promise(_ => setTimeoutClearable(_, (animationDuration + animationInterval * numSeeds) * 1000));
    }
}
