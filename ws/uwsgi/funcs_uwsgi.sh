start() {
	uwsgi_latest_from_installer/uwsgi --ini uwsgi_latest_from_installer/config.ini&
}

stop() {
	id=$(ps -ax | grep uwsgi | grep ini | grep -o '^[0-9]*');
	kill $id;
}
