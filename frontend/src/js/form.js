import 'bootstrap'; 

export default class Form {
     constructor() {
          this.searchDialogSelectedEntry = null,
          this.searchDialogData = [],
          this.searchDialogQuery = '',
          this.searchDialogTitle = null,
          this.loaderDialog = null     
     }
     
     searchDialogFilteredData() {
          return this.searchDialogData.filter(entry => 
               entry.KURZBEZ.toLowerCase().includes(this.searchDialogQuery.toLowerCase()) ||
               entry.NAME1.toLowerCase().includes(this.searchDialogQuery.toLowerCase()) ||
               entry.VORGNR.toLowerCase().includes(this.searchDialogQuery.toLowerCase())
          );
     }

     async showSearchDialog(title, data) {
          return new Promise((resolve) => {
               this.searchDialogTitle = title;
               this.searchDialogData = data;
               this.searchDialogQuery = '';
               this.resolveSearch = resolve; // Store the resolve function

               const modal = new bootstrap.Modal(document.getElementById('myModal'));
               modal.show();
          });
     }

     selectedSearchEntry(entry) {
          this.searchDialogSelectedEntry = this.searchDialogSelectedEntry === entry ? null : entry;
     }

     confirmedSearchSelection() {
          if (this.searchDialogSelectedEntry) {
               //console.log('Selected Vorang ID: ', this.searchDialogSelectedEntry);
          }
          
          if (this.resolveSearch) {
               this.resolveSearch(this.searchDialogSelectedEntry);
          }

          const myModal = bootstrap.Modal.getInstance(document.getElementById('myModal'));
          myModal.hide();
     }

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
          loaderImage.src = 'static/images/loader.gif'; 
          loaderImage.alt = 'Loading...';
          loaderImage.style.width = '100px';

          this.loaderDialog.appendChild(loaderImage);
          document.body.appendChild(this.loaderDialog); 
     }

     hideLoaderDialog()
     {
          document.body.removeChild(this.loaderDialog);
     }
}