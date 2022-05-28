Uruchamianie:

zaczynamy od npm init
W folderze aplikacja należy wywołać 'sudo docker-compose up'

Powinien się wyświetlić komunikat że czeka na wiadomości. 
Wtedy na localhost:15673 można się zalogować do RabbitMD, login i hasło - guest guest i obejrzeć działającą kolejkę.

W drugim terminalu w folderze front wywołujemy node front.js.
Jest postawiony na localhost:8080
Można kliknąć w link przechodzący do strony z matchami albo wysłać coś do kolejki rabbitMQ
W terminalu z uruchomionymy relacjami widać wówczas że została wysłana jakaś wiadomość



