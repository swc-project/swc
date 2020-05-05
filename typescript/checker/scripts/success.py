#!/usr/bin/env python3

# This file remove golden (done) tests from ./tests/success.txt


def read_successes():
    with open('./tests/success.txt', 'r') as f:
        return sorted(list(set(f.readlines())))


def read_done():
    with open('./tests/done.txt', 'r') as f:
        return sorted(list(set(f.readlines())))


def main():
    successed = read_successes()
    done = read_done()
    print('loaded success.txt and done.txt')
    new_successes = []
    for s in successed:
        matched = False
        for d in done:
            if s.strip('\n').startswith(d.strip('\n')):
                matched = True
                break
        if not matched:
            new_successes.append(s)
    with open('tests/success.txt', 'w') as f:
        f.write(''.join(new_successes))


if __name__ == '__main__':
    main()
