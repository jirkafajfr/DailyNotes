import * as assert from 'assert';
import * as TypeMoq from 'typemoq';

import * as vscode from 'vscode';
import { MarkdownWorker, IDocumentService, IMessageService, IContentService } from '../src/markdown-worker';

suite("MarkdownWorker Tests", () => {

    let messageMock: TypeMoq.IMock<IMessageService>;
    let documentMock: TypeMoq.IMock<IDocumentService>;
    let contentMock: TypeMoq.IMock<IContentService>;
    let worker: MarkdownWorker;

    setup(() => {
        messageMock = TypeMoq.Mock.ofType<IMessageService>();
        documentMock = TypeMoq.Mock.ofType<IDocumentService>();
        contentMock = TypeMoq.Mock.ofType<IContentService>();
        worker = new MarkdownWorker(messageMock.object, documentMock.object, contentMock.object);
    });

    test("empty working dir yields warning message", () => {
        documentMock.setup(x => x.workingFolder).returns(() => "");
        messageMock.setup(x => x.showWarning(TypeMoq.It.isAnyString())).returns(() => Promise.resolve('some message'));

        return worker.execute()
            .then(() => {
                messageMock.verify(x => x.showWarning(TypeMoq.It.isAnyString()), TypeMoq.Times.once());
            });

    });

    test("file is opened and not created when exists", () => {
        documentMock.setup(x => x.workingFolder).returns(() => 'd:/');
        documentMock.setup(x => x.exists(TypeMoq.It.isAny())).returns(() => Promise.resolve());
        documentMock.setup(x => x.open(TypeMoq.It.isAny())).returns(() => Promise.resolve(null));

        return worker.execute()
            .then(() => {
                documentMock.verify(x => x.exists(TypeMoq.It.isAnyString()), TypeMoq.Times.once());
                documentMock.verify(x => x.create(TypeMoq.It.isAnyString(), TypeMoq.It.isAny()), TypeMoq.Times.never());
                documentMock.verify(x => x.open(TypeMoq.It.isAnyString()), TypeMoq.Times.once());
            });
    });

    test("file is created and opened when doesn't exist", () => {
        documentMock.setup(x => x.workingFolder).returns(() => 'd:/');
        documentMock.setup(x => x.exists(TypeMoq.It.isAny())).returns(() => Promise.reject("file doesn't exist"));
        documentMock.setup(x => x.open(TypeMoq.It.isAny())).returns(() => Promise.resolve(null));
        documentMock.setup(x => x.create(TypeMoq.It.isAny(), TypeMoq.It.isAny())).returns(() => Promise.resolve());
        
        return worker.execute()
            .then(() => {
                documentMock.verify(x => x.exists(TypeMoq.It.isAnyString()), TypeMoq.Times.once());
                documentMock.verify(x => x.create(TypeMoq.It.isAnyString(), TypeMoq.It.isAny()), TypeMoq.Times.once());
                documentMock.verify(x => x.open(TypeMoq.It.isAnyString()), TypeMoq.Times.once());
            });
    });

});