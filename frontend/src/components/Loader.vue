showLoaderDialog()
     {
          this.loaderDialog = document.createElement('div');
          this.loaderDialog.style.position = 'fixed';
          this.loaderDialog.style.top = '0';
          this.loaderDialog.style.left = '0';
          this.loaderDialog.style.width = '100%';
          this.loaderDialog.style.height = '100%';
          this.loaderDialog.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
          this.loaderDialog.style.display = 'flex';
          this.loaderDialog.style.justifyContent = 'center';
          this.loaderDialog.style.alignItems = 'center';
          this.loaderDialog.style.zIndex = '9999';

          const loaderImage = document.createElement('img');
          loaderImage.src = loaderGif; 
          loaderImage.alt = 'Loading...';
          loaderImage.style.width = '100px';

          this.loaderDialog.appendChild(loaderImage);
          document.body.appendChild(this.loaderDialog); 
     }

     hideLoaderDialog()
     {
          document.body.removeChild(this.loaderDialog);
     }