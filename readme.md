Uruchamianie:

zaczynamy od npm init
W folderze aplikacja należy wywołać 'sudo docker-compose up'.
Ta komenda uruchamia całą aplikację: relacje, frontend i system kolejkowy.

Powinien się wyświetlić komunikat że czeka na wiadomości.
Wtedy na localhost:15673 można się zalogować do RabbitMD, login i hasło - guest guest i obejrzeć działającą kolejkę.

Na localhost:8080 działa frontend.
Można kliknąć w link przechodzący do strony z matchami albo wysłać coś do kolejki rabbitMQ
W terminalu widać, że została wysłana jakaś wiadomość.
