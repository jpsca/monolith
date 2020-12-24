.PHONY: install
install:
	pip install -U pip
	pip install -r requirements.txt

.PHONY: run
run:
	export FLASK_APP=hello.py
	export FLASK_ENV=development
	flask run --host=0.0.0.0
