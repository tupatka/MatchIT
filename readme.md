Uruchamianie:

npm init
w głównym folderze aplikacja 'sudo docker-compose up'

Powinien się wyświetlić komunikat że czeka na wiadomości. 
Wtedy na localhost:15673 można się zalogować do RabbitMD, login i hasło - guest guest i obejrzeć działającą kolejkę.

Na porcie 8080 jest postawiony front.
Pod adresem localhost:8080/get_relacje można zobaczyć co zostało wysłane

W drugim terminalu w folderze front wywołujemy node front.js, powinno być w poprzednim widać że wysłał się mail. 