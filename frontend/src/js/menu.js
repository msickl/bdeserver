export default class Menu {
    constructor() {
        this.current = 1,
        this.showSidebar = false,
        this.showLoginForm = false
    }

    navigate(targetMenuId) {
        this.current = targetMenuId;
    }

    toggleSidebar()
    {
        this.showSidebar = !this.showSidebar;
    }

    hideSidebar()
    {
        this.showSidebar = false;
    }

    toggleLoginForm()
    {
        this.showLoginForm = !this.showLoginForm;
    }
}