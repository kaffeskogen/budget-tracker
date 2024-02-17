import { Observable } from "rxjs";

export interface AuthProps {
    baseUrl: string;
    queryParams: {
        client_id: string;
        redirect_uri?: string;
        response_type?: string;
        scope: string;
        state?: string;
    }
}

export class Auth {
    props: AuthProps;
    constructor(props: AuthProps) {
        this.props = props;
        this.props.queryParams.redirect_uri = this.props.queryParams.redirect_uri || window.location.origin + '/oauth2.html';
        this.props.queryParams.response_type = this.props.queryParams.response_type || 'token';
    }

    public getToken(): Promise<string>{
        const url = this.props.baseUrl + '?' + new URLSearchParams(this.props.queryParams).toString();
        window.open(url, '_blank', 'popup,height=570,width=520');

        return new Promise((resolve) => {
            window.addEventListener('message', (event) => {
                resolve(event.data);
            }
        )});
    }
}