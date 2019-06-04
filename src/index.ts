interface LivingBeing {
    // TODO implement
}

// TODO implement: it should have 2 properties: position, which can be one of the keeper, guard or owner 
// and pay which is a number
interface Job {
}

class Animal implements LivingBeing {
    private alive = true;

    // TODO implement
    public constructor() {
    }

    // TODO ...
}

// TODO implement
class Human ... {
    private alive = true;
}

// TODO implement
class Lion ... {
}

// TODO implement
class Cow ... {
}

// TODO implement
class Snake ... {
}

class Zoo {
    public constructor() {
        const lion = new Lion();
        const cow = new Cow();
        const snake = new Snake();

        const keeper = new Human('John', { position: 'keeper', pay: 1000 });

        console.log('>> Lion: ', lion.describe());
        console.log('>> Cow: ', cow.describe());
        console.log('>> Snake: ', snake.describe());
        console.log('>> John: ', keeper.describe());

        cow.die();
        console.log('>> Cow: ', cow.describe());
    }
}

const zoo = new Zoo();

// TODO
// add abstract class examples