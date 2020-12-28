from flask import Markup, Response, render_template


MIME_UPDATE = "text/html; turbo-stream"


def render_update(tmpl, status=None, **kwargs):
    resp = Response(status=status)
    resp.headers["Content-Type"] = MIME_UPDATE
    html = render_template(tmpl, **kwargs).strip()
    resp.set_data(html)
    return resp


STREAM_TMPL = '<turbo-stream action="%s" target="%s"><template>%s<template></turbo-stream>'
VALID_ACTIONS = ("append", "prepend", "replace", "update", "remove")


class TurboStreamTagBuilder:
    def __getattr__(self, name):
        if name not in VALID_ACTIONS:
            raise AttributeError

        def action(target, value=""):
            if name == "remove":
                value = ""
            return Markup(STREAM_TMPL % (name, target, value))

        return action


turbo_stream = TurboStreamTagBuilder()
