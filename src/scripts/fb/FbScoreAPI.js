var CryptoJS = require("crypto-js");

class FbScoreAPI
{
    constructor()
    {
        this.crossdomain = true;
        this.url = 'http://facebook-score-domain.eu-west-1.elasticbeanstalk.com/';
       // this.url = 'http://127.0.0.1:5000/';
       //
        this.saving = false;
    }
//curl -H "Content-Type: application/json" -X POST -d '{"ids":[111, 123, 127, 125, 1239]}' http://facebook-score-domain.eu-west-1.elasticbeanstalk.com/api/get-scores


    sendScore( user, score )
    {
        if(this.saving)return this.promise;

        this.saving = true;

        this.promise = new Promise( ( resolve, reject ) => {

            const request = this.getRequest();
            const url = this.url + 'api/set-score';

            const id = (Math.random() * 10000)|0;

            const data = {user, id, score};

            const ciphertext = CryptoJS.AES.encrypt( JSON.stringify(data), '----fb-gb----').toString();

            request.onload = () => {

                if (request.status === 200)
                {
                    this.saving = false;
                    resolve(request.response);
                }
                else
                {
                    this.saving = false;
                    reject(Error('Scores didn\'t load successfully; error code:' + request.statusText));
                }
            };

            request.onerror = () => {
                reject(Error('There was a network error.'));
            };


            request.open('POST', url, true);
            request.setRequestHeader( "Content-type", "application/json" );

            var serialized = JSON.stringify({data:ciphertext});

            console.log('sending: ', serialized)
         //   request.withCredentials = true;
            request.send(serialized);
        })

        return this.promise;
    }

    getScores( ids )
    {
        return new Promise( ( resolve, reject ) => {

            const request = this.getRequest();
            const url = this.url + 'api/get-scores';

            // When the request loads, check whether it was successful
            request.onload = function()
            {
                if (request.status === 200)
                {
                    // If successful, resolve the promise by passing back the request response
                    resolve( JSON.parse( request.response ) );
                }
                else
                {
                    // If it fails, reject the promise with a error message
                    reject(Error('Scores didn\'t load successfully; error code:' + request.statusText));
                }
            };

            request.onerror = function()
            {
                // Also deal with the case when the entire request fails to begin with
                // This is probably a network error, so reject the promise with an appropriate message
                reject(Error('There was a network error.'));
            };

            console.log(JSON.stringify({ids}));

            request.open('POST', url, true);
            request.setRequestHeader( "Content-type", "application/json" );
         //   request.withCredentials = true;
            request.send(JSON.stringify({ids}));

        });
    }

    getRequest()
    {
        var request;

        if(window.XDomainRequest && this.crossdomain)
        {
            request = new window.XDomainRequest();
            // XDomainRequest has a few querks. Occasionally it will abort requests
            // A way to avoid this is to make sure ALL callbacks are set even if not used
            // More info here: http://stackoverflow.com/questions/15786966/xdomainrequest-aborts-post-on-ie-9
            request.timeout = 3000;

            request.onerror = function(){};

            request.ontimeout = function(){};

            request.onprogress = function(){};

        }
        else if (window.XMLHttpRequest)
        {
            request = new window.XMLHttpRequest();
        }

        return request;

    }
}


export default new FbScoreAPI();
