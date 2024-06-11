

export default class ApplicationHandler extends Error{
    constructor(message, code){
        super(message);
        this.code = code;
    }
}