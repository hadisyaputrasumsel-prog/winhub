<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::orderBy('id', 'asc');

        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('role', 'like', "%{$search}%");
        }

        if ($request->has('role') && $request->input('role') !== 'all') {
            $query->where('role', $request->input('role'));
        }

        $users = $query->paginate(15);

        return view('users.index', compact('users'));
    }
    public function create()
    {
        return view('users.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|string|unique:users,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|string',
            'phone' => 'nullable|string',
        ]);

        $validated['password'] = bcrypt($validated['password']);

        if (in_array($validated['role'], ['Super Admin', 'Manager']) && auth()->user()->role !== 'Super Admin') {
            return back()->withErrors(['role' => 'Anda tidak memiliki hak untuk membuat akun dengan level eksekutif/Super Admin.'])->withInput();
        }

        User::create($validated);

        return redirect()->route('users.index')->with('success', 'User berhasil ditambahkan.');
    }

    public function edit(User $user)
    {
        if (in_array($user->role, ['Super Admin', 'Manager']) && auth()->user()->role !== 'Super Admin') {
            return redirect()->route('users.index')->with('error', 'Anda tidak memiliki hak untuk mengubah akun level eksekutif/Super Admin.');
        }

        return view('users.edit', compact('user'));
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:6',
            'role' => 'required|string',
            'phone' => 'nullable|string',
        ]);

        if (!empty($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        } else {
            unset($validated['password']);
        }

        if (in_array($user->role, ['Super Admin', 'Manager']) && auth()->user()->role !== 'Super Admin') {
            return redirect()->route('users.index')->with('error', 'Anda tidak memiliki hak untuk mengubah akun ini.');
        }

        if (in_array($validated['role'], ['Super Admin', 'Manager']) && auth()->user()->role !== 'Super Admin') {
            return back()->withErrors(['role' => 'Anda tidak memiliki hak untuk menetapkan role level eksekutif/Super Admin.'])->withInput();
        }

        $user->update($validated);

        return redirect()->route('users.index')->with('success', 'User berhasil diubah.');
    }

    public function destroy(User $user)
    {
        if ($user->id === 'usr-00' || $user->id === auth()->id()) {
            return redirect()->route('users.index')->with('error', 'User ini tidak dapat dihapus.');
        }

        if (in_array($user->role, ['Super Admin', 'Manager']) && auth()->user()->role !== 'Super Admin') {
            return redirect()->route('users.index')->with('error', 'Anda tidak memiliki hak untuk menghapus akun level eksekutif/Super Admin.');
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User berhasil dihapus.');
    }
}
