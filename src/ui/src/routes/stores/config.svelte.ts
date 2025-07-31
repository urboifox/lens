class Config {
    private apiUrl = $state<string>();

    get url() {
        return this.apiUrl;
    }

    set url(value) {
        this.apiUrl = value;
    }
}

export const config = new Config();
